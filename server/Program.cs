using Server.Services;
using Server.Middlewares;
using Server.Endpoints;
using Server.Repositories;
using Server;
using Server.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Oracle_DB_DEV")!;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowMainClientPolicy", builder => {
        builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var userRepository = new UserRepository(connectionString);

builder.Services.AddSingleton(userRepository);

builder.Services.AddSingleton(new UserService(userRepository: userRepository));
builder.Services.AddSingleton(new EngineMovesService());

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("AllowMainClientPolicy");

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<AuthenticationMiddleware>();

var apiV1 = app.MapGroup("/api/v1");

apiV1.MapGroup("/users")
    .MapUserEndpoints()
    .WithTags("Users API v1");

apiV1.MapGroup("/user-credentials")
    .MapUserCredentialsEndpoints()
    .WithMetadata(new ProtectedRouteMetadata())
    .WithTags("User credentials API v1");

apiV1.MapGroup("/engines/arasan/")
    .MapEngineMovesEndpoints()
    .WithMetadata(new ProtectedRouteMetadata())
    .WithTags("Engine moves API v1");

app.Run();
