using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        Task<MessageDto> SendMessage(int senderId, int recieverId, string message);
        Task<IEnumerable<MessageDto>> GetMessages(int senderId, int recieverId);
    }
}