using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Interfaces;

namespace API.Entites
{
    public class UserMessage
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime TimeStamp { get; set; }
        public AppUser Reciever {get; set;}
        public AppUser Sender {get; set;}
        public int SenderId { get; set; }
        public int RecieverId { get; set; }
    }
}