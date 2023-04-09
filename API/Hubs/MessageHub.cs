using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMessage(string user)
        {
            await Clients.All.SendAsync("ReceiveGreeting", $"Good Morning {user}");
        }
    }
}