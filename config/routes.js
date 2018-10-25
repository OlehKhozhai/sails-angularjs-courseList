
module.exports.routes = {

  'post /on-connect': 'TestController.onConnect',

  'post /send': 'TestController.send',
  'put /update': 'TestController.update',
  'delete /delete-msg': 'TestController.delete'

};
