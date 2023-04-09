using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MessageCreateDto
    {
        public string Message { get; set; }
        public int RecieverId { get; set; }
        public string RecieverName { get; set; }
    }
}