'''
Created on Nov 25, 2015

@author: Joseph
'''
import requests
import time
import json


def process_abios_match_object(abios_match_obj, find_winner = False):
    
    game_name = ''
    
    abios_game_title = abios_match_obj.get('game_title')
    
    if (abios_game_title == 'Dota 2'):
        game_name = 'DOTA2'
    elif (abios_game_title == 'CS:GO'):
        game_name = "CSGO"
    elif (abios_game_title == 'LoL'):
        game_name = 'LOL'
    
    if (game_name == ''):
        return
    
    team1name = abios_match_obj.get('compA_name').strip()
    team2name = abios_match_obj.get('compB_name').strip()
    
    outcome_names = [team1name, team2name]
    outcome_names = sorted(outcome_names)
    
    tourney_name = abios_match_obj.get('tournament_title').strip()
    epoch = abios_match_obj.get('start')
    matchStartTime = time.strftime('%Y-%m-%dT%H:%M:%S', time.localtime(epoch))
    
    game_obj = {
                'gameName': game_name,
                'tourneyName': tourney_name,
                'outcomeNames' : outcome_names,
                'matchStartTime': matchStartTime
                }
    
    if (find_winner):
        homescore = int(abios_match_obj.get('scoreA'))
        awayscore = int(abios_match_obj.get('scoreB'))
        
        if (homescore > awayscore):
            game_obj.update({'scraped_result': 1})
        elif (homescore < awayscore):
            game_obj.update({'scraped_result': 2})
        
        # if we switched the two around, we need to reverse these two too.
        if (team2name == outcome_names[0]):
            if (game_obj.get('scraped_result') == 1):
                game_obj.update({'scraped_result': 2})
            elif (game_obj.get('scraped_result') == 2):
                game_obj.update({'scraped_result': 1})
    
    print(json.dumps(game_obj))
    return

'''
@upcoming - Boolean: If true, then requests future match. if not, then requests past match.
'''
def request_matches(num_matches, upcoming, find_winner):
    url = "http://abiosgaming.com/ajax/match?take=" + str(num_matches)
    
    if (upcoming):
        url += "&upcoming=true"
    else:
        url += "&past=true"
        
    #make the request
    matches = requests.get(url)
    
    #TODO: catch for 500
    
    matches = json.loads(matches._content)
    
    #process each one.
    for match in matches:
        process_abios_match_object(match, find_winner)
    
    return

if __name__ == '__main__':
    request_matches(50, False, True)