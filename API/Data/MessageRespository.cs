using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entites;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRespository : IMessageRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        public MessageRespository(DataContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }



        public async Task<IEnumerable<MessageDto>> GetMessages(int senderId, int recieverId)
        {
            var messages = await context.Messages.Where(x => (x.RecieverId == recieverId && x.SenderId == senderId) || (x.RecieverId == senderId && x.SenderId == recieverId)).ProjectTo<MessageDto>(mapper.ConfigurationProvider).OrderBy(x=> x.TimeStamp).ToListAsync();
            return messages;
            // var userWithMessages =  context.Users.Include(x=> x.SentMessages).Include(n=> n.RecievedMessages).ProjectTo<MemberWithMessages>(mapper.ConfigurationProvider);
            // var user = await userWithMessages.Where(x=> x.Id == senderId).FirstOrDefaultAsync();
            // return  user.Messages;
        }

        public async Task<MessageDto> SendMessage(int senderId, int recieverId, string message)
        {
            var senderMessage = new UserMessage
            {
                Message = message,
                TimeStamp = DateTime.Now,
                SenderId = senderId,
                RecieverId = recieverId
            };
            context.Messages.Add(senderMessage);
            await context.SaveChangesAsync();
            return mapper.Map<MessageDto>(senderMessage);

        }
    }
}