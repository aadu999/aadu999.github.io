from wit import Wit
from newsapi import NewsApiClient
api = NewsApiClient(api_key='cf1cf535ba964b55904e6210fdea55d8')
access_token = "HGCWREUQGRLV4X6HOG2IGPQRAWICCRGT"
client = Wit(access_token = access_token)


def wit_response(message):
    resp = client.message(message)
    #print(resp)
    #print(resp['entities']['newstype'][0]['value'])
    entities = list(resp['entities'])
    #print(entities)
    query = {'newstype':None,'location':None,'wikipedia_search_query':None}
    for entity in entities:
        query[entity] = resp['entities'][entity][0]['value']
    return query

def get_news(query):
    elements = []
    try:
        location=query['location'].lower()
        newstype=query['newstype'].lower()
        headLines=api.get_top_headlines(q='{}'.format(location),category=newstype,page_size=5)
        #print(headLines['articles'][1]['title'])
        elements = []
        for item in headLines['articles']:
            #print(item['title'])
            element = {
                'title':item['title'],
                'buttons': [{
                    'type':'web_url',
                    'title':'Read More',
                    'url':item['url']
                }],
                'image_url':item['urlToImage']
            }
            elements.append(element)
    except:
        element = {
                'title':'Sorry, I am Still a Baby news bot!',
                'buttons': [{
                    'type':'web_url',
                    'title':'Read More',
                    'url':'https://adarsh.online'
                }],
                'image_url':'https://cdn.technologyadvice.com/wp-content/uploads/2018/02/friendly-chatbot-700x408.jpg'
            }
        elements.append(element)
    return elements

#print(get_news(wit_response("SHow me entertainment news from India")))