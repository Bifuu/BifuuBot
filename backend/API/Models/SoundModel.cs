using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class SoundModel
    {
        public string Name { get; set; }
        public string FileName { get; set; }
        public IFormFile files { get; set; }
    }
}
