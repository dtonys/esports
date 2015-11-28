'''
Created on Nov 25, 2015

@author: Joseph
'''
import requests
import json

def process_abios_tourney_object(abios_tournament_object):
    
    game_part = abios_tournament_object.get('game')
    
    game_name = game_part.get('title')
    
    accepted_games = ["Dota 2", "CS:GO", "LoL"]
    
    if (not (game_name in accepted_games)):
        return
    
    tourney_name = abios_tournament_object.get('title')
    tourney_name = tourney_name.replace(u"\u2013", "-").strip()
    
    tourney_obj = {
                   "name" : tourney_name
                   }
    
    print(json.dumps(tourney_obj))
    
    return

def request_tournaments(num_tournies):
    
    url = 'http://abiosgaming.com/ajax/tournaments?take=' + str(num_tournies)
    
    tourney_payload = requests.get(url)._content
    
    #TODO: catch for 500
    
    tourney_payload = json.loads(tourney_payload)
    
    '''PAYLOAD STRUCTURE
    featured
    - tournament_obj
    list
    - tournament_obj
    '''
    
    tourney_list = tourney_payload.get('featured') + tourney_payload.get('list')
    
    for tourney in tourney_list:
        process_abios_tourney_object(tourney)
    
    
    return

if __name__ == '__main__':
    request_tournaments(50)