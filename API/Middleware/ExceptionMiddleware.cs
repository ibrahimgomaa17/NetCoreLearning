using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        public RequestDelegate Next { get; }
        private readonly ILogger<ExceptionMiddleware> Logger;
        public IHostEnvironment Env { get; }
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> Logger, IHostEnvironment env)
        {
            this.Env = env;
            this.Logger = Logger;
            this.Next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await Next(context);
            }
            catch (System.Exception ex)
            {
                Logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)System.Net.HttpStatusCode.InternalServerError;
                var response = Env.IsDevelopment() 
                ? new Errors.ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString()) 
                : new Errors.ApiException(context.Response.StatusCode, "Internal Server Error");
                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json);
            }
        }
    }
}