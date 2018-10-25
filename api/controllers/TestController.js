/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    onConnect: function(req, res) {
      if (!req.isSocket) {
        return res.badRequest('Only socket accepted');
      }
       sails.sockets.join(req, 'channel')
       return res.ok();
    },

    send: async function(req, res){
      if (!req.isSocket) {
        return res.badRequest('Only socket accepted');
      }
      const course = {
        name : req.body.name,
        done: req.body.done
      }
      let newCourse = await Test.create(course).fetch();
      sails.sockets.broadcast('channel','newCourse', newCourse)
      return res.ok();
    },

    update: async function(req, res){
      if (!req.isSocket) {
        return res.badRequest('Only socket accepted');
      } 
        let data = { id:req.body.id, done: req.body.done };
        await Test.update({id:req.body.id}).set({ done: req.body.done }).fetch();

      sails.sockets.broadcast('channel', 'updateDone', data )

    },

    delete: async function(req, res){
      if (!req.isSocket) { 
        return res.badRequest('Only socket accepted');
      }
     await Test.destroy({ id:req.body.id }).fetch();
      
      sails.sockets.broadcast('channel', 'delete', {id : req.body.id} )
    }

};

