using Server.Services;
using Server.Middlewares;
using Server.Endpoints;

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddSingleton(new EngineMovesService());

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("AllowMainClientPolicy");

app.UseMiddleware<ExceptionMiddleware>();

app.MapGroup("/api/v1")
    .MapGroup("/engines/arasan/")
    .MapEngineMovesEndpoints()
    .WithTags("Engine moves API v1");

app.Run();
