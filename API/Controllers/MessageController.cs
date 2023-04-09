using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Extensions;
using API.Hubs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Authorize]
    public class MessageController : BaseApiController
    {
        private readonly IMessageRepository MessageRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;
        private readonly IHubContext<MessageHub> hub;
        public MessageController(IHubContext<MessageHub> hub, IUserRepository userRepository, IMessageRepository MessageRepository, IMapper mapper)
        {
            this.hub = hub;
            this.mapper = mapper;
            this.userRepository = userRepository;
            this.MessageRepository = MessageRepository;
        }

        [HttpPost("send")]
        public async Task<ActionResult> sendMessage(MessageCreateDto message)
        {
            var result = await MessageRepository.SendMessage(User.GetUserId(), message.RecieverId, message.Message);
            await hub.Clients.All.SendAsync("SendMessage", result);
            return Ok(result);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages(int userId)
        {
            var messages = await MessageRepository.GetMessages(User.GetUserId(), userId);
            return Ok(messages);
        }
    }
}