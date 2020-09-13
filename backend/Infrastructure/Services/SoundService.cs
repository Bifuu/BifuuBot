using Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using System.Diagnostics;
using System.IO;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class SoundService : ISoundService
    {
        private readonly IWebHostEnvironment env;

        public SoundService(IWebHostEnvironment env)
        {
            this.env = env;
        }

        public async Task<Sound> CreateSoundFileAsync(string pathToAudioFileToConvert, string name)
        {
            if (!Directory.Exists(env.WebRootPath + "\\Sounds\\"))
            {
                Directory.CreateDirectory(env.WebRootPath + "\\Sounds\\");
            }

            using (var ffmpeg = CreateProcess(pathToAudioFileToConvert))
            using (var output = ffmpeg.StandardOutput.BaseStream)
            using (FileStream fileStream = File.Create(env.WebRootPath + "\\Sounds\\" + name + ".ogg"))
            {
                try
                {
                    await output.CopyToAsync(fileStream);
                }
                finally
                {
                    await fileStream.FlushAsync();
                    ffmpeg.WaitForExit();
                }
            }

            var sound = new Sound()
            {
                Name = name,
                FileName = name + ".ogg",
            };

            return sound;
        }

        private Process CreateProcess(string path)
        {

            return Process.Start(new ProcessStartInfo
            {
                FileName = "ffmpeg",
                Arguments = $"-hide_banner -loglevel verbose -i \"{path}\" -c:a libopus -b:a 128k -f ogg pipe:1",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                CreateNoWindow = false
            });
        }
    }
}
