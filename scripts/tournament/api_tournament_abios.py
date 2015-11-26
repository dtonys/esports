'''
Created on Nov 25, 2015

@author: Joseph
'''
import requests
import json

def process_abios_tourney_object(tournament_object):
    
    game_part = tournament_object.get('game')
    
    tourney_name = tournament_object.get('title')
    
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