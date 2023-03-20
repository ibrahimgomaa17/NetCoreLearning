using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class LikeParams:PaginationParams
    {
        public string Predicate { get; set; } = "liked";
    }
}