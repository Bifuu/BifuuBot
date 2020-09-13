using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SoundsController : BaseApiController
    {
        private readonly IRepository<Sound> soundsRepo;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment env;
        private readonly ISoundService soundService;

        public SoundsController(IRepository<Sound> soundsRepo, IMapper mapper, IWebHostEnvironment env, ISoundService soundService)
        {
            this.soundsRepo = soundsRepo;
            this.mapper = mapper;
            this.env = env;
            this.soundService = soundService;
        }

        [HttpGet]
        public async Task<ActionResult<SoundModel[]>> GetSounds()
        {
            try
            {
                var results = await soundsRepo.GetAll();

                SoundModel[] models = mapper.Map<SoundModel[]>(results);

                return Ok(models);
            }
            catch (Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Dattabase error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Sound>> PostSound([FromForm] SoundModel model)
        {
            try
            {
                if (model.files.Length < 0) return BadRequest();

                var existing = await soundsRepo.Find(s => s.Name == model.Name);
                if (existing.Any()) return BadRequest();

                if (!Directory.Exists(env.WebRootPath + "\\Upload\\"))
                {
                    Directory.CreateDirectory(env.WebRootPath + "\\Upload\\");
                }

                using (FileStream fileStream = System.IO.File.Create(env.WebRootPath + "\\Upload\\" + model.files.FileName))
                {
                    await model.files.CopyToAsync(fileStream);
                    await fileStream.FlushAsync();
                    
                }


                var sound = await soundService.CreateSoundFileAsync(env.WebRootPath + "\\Upload\\" + model.files.FileName, model.Name);
                soundsRepo.Add(sound);

                if (await soundsRepo.SaveChanges())
                {
                    return Ok(sound);
                }
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message.ToString());
            }

            return BadRequest();
            
        }
    }
}
