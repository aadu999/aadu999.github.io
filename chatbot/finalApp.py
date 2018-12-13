import os, sys
from flask import Flask, request
from pymessenger import Bot
import wikipedia
from finalUtil import wit_response,get_news
app = Flask(__name__)

PAGE_ACCESS_TOKEN = "EAAUC5Kqm1w8BAHvz9QayuJ567M9AsOVDahmJjZBnxu3JgKT0ZCpo7KnTfaqXzpKx5LHptWrvdK4UZAlYHN51yLbgIBNu9B05Q0qnmqd8ZAqmvfrBAj5A1GDRslVbZB9nG0Fnt2KhCIIt9wt2CNSqLHnflJNrVMSWHTmlRmeZBsEQZDZD"

bot = Bot(PAGE_ACCESS_TOKEN)


@app.route('/', methods=['GET'])
def verify():
	# Webhook verification
    if request.args.get("hub.mode") == "subscribe" and request.args.get("hub.challenge"):
        if not request.args.get("hub.verify_token") == "hello":
            return "Verification token mismatch", 403
        return request.args["hub.challenge"], 200
    return "Hello world", 200


@app.route('/', methods=['POST'])
def webhook():
	data = request.get_json()
	log(data)

	if data['object'] == 'page':
		for entry in data['entry']:
			for messaging_event in entry['messaging']:

				# IDs
				sender_id = messaging_event['sender']['id']
				recipient_id = messaging_event['recipient']['id']

				if messaging_event.get('message'):
					# Extracting text message
					if 'text' in messaging_event['message']:
						messaging_text = messaging_event['message']['text']
					else:
						messaging_text = 'no text'

					response = None

					query = wit_response(messaging_text)
					elements = get_news(query)
					#print(elements)
					element = [{
					'title':'Hello',
					'image_url':'https://www.thehindu.com/news/national/kerala/dna8kd/article25657077.ece/ALTERNATES/LANDSCAPE_615/tv04disha1'
					}]
					bot.send_generic_message(sender_id, elements)

	return "ok", 200


def log(message):
	print(message)
	sys.stdout.flush()


if __name__ == "__main__":
	app.run(debug = True, port = 80)