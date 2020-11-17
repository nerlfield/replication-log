from flask import Flask
from flask_restx import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

messages = {
    'message1': {'task': 'build an API'},
    'message2': {'task': '?????'},
    'message3': {'task': 'profit!'},
}


def abort_if_todo_doesnt_exist(todo_id):
    if todo_id not in messages:
        abort(404, message="Message {} doesn't exist".format(todo_id))


parser = reqparse.RequestParser()
parser.add_argument('task')

class Message(Resource):
    def get(self, message_id):
        abort_if_todo_doesnt_exist(message_id)
        return messages[message_id]

    def delete(self, message_id):
        abort_if_todo_doesnt_exist(message_id)
        del messages[message_id]
        return '', 204

    def put(self, message_id):
        args = parser.parse_args()
        task = {'task': args['task']}
        messages[message_id] = task
        return task, 201


class MessageList(Resource):
    def get(self):
        return messages

    def post(self):
        args = parser.parse_args()
        message_id = 'todo%d' % (len(messages) + 1)
        messages[message_id] = {'task': args['task']}
        return messages[message_id], 201


api.add_resource(MessageList, '/messages')
api.add_resource(Message, '/messages/<string:message_id>')

if __name__ == '__main__':
    app.run(debug=True)
