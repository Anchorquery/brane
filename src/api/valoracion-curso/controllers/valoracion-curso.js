"use strict";

/**
 * valoracion-curso controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::valoracion-curso.valoracion-curso",
  ({ strapi }) => ({
    //modifico el create para que las valoraciones sean creadas solo por usuarios inscritos en el curso y el administrador

    async create(ctx) {
      // obtengo el usuario que está haciendo la petición

      const user = ctx.state.user;

      //obtengo el id del curso al que se le quiere crear la valoración

      //    si el usuario que está haciendo la petición no está logueado, no puede crear la valoración

      if (!user) {
        return ctx.unauthorized(`You can't create this entry`);
      }

      
             
      const id = ctx.request.body.data.curso;

      // busco el curso verificando si pertece al usuario que está haciendo la petición

      const misCursos = await strapi.db.query("api::mis-curso.mis-curso").findOne({
        where: { usuario: user.id, curso: id },
      });




      // si el usuario que está haciendo la petición no está inscrito en el curso y no es administrador, no puede crear la valoración

      if (!misCursos && user.role.type != "administrador") {
        return ctx.unauthorized(`You can't create this entry`);
      }

      // si el usuario que está haciendo la petición está inscrito en el curso o es administrador, puede crear la valoración

      return await super.create(ctx);
    },


  })
);
