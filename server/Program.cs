using Middlewares;
using Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(new EngineMovesService());

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseMiddleware<ExceptionMiddleware>();

app.MapGroup("/api/v1")
    .MapGroup("/engines/arasan/")
    .MapEngineMovesEndpoints()
    .WithTags("Engine moves API v1");

app.Run();
