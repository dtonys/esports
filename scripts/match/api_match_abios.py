'''
Created on Nov 25, 2015

@author: Joseph
'''
import requests
import time
import json
import sys

def process_abios_match_object(abios_match_obj, find_winner = False):
    
    try:
        
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
        tourney_name = tourney_name.replace(u"\u2013", "-")
        
        epoch = abios_match_obj.get('start')
        matchStartTime = time.strftime('%Y-%m-%dT%H:%M:%S', time.localtime(epoch))
        
        game_obj = {
                    'gameName': game_name,
                    'tourneyName': tourney_name,
                    'outcomeNames' : outcome_names,
                    'matchStartTime': matchStartTime
                    }
        
        if (find_winner):
            
            homescore = abios_match_obj.get('scoreA')
            awayscore = abios_match_obj.get('scoreB')
            
            if (homescore is not None):
                homescore = int(homescore)
            else:
                homescore = 0
            
            if (awayscore is not None):
                awayscore = int(awayscore)
            else:
                awayscore = 0
            
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
    
    except Exception:
        pass
        
    return

'''
@upcoming - Boolean: If true, then requests future match. if not, then requests past match.
'''
def request_matches(num_matches, upcoming, find_winner):
    #url = "http://abiosgaming.com/ajax/match?take=" + str(num_matches)
    
    #dunno why i have to put a games array.
    url = "http://abiosgaming.com/ajax/matches?games[]=&games[]=1&games[]=2&games[]=5&take=" + str(num_matches)
    '''
    1: DOTA
    2: LOL
    5: CSGO
    '''
    #http://abiosgaming.com/ajax/matches?games[]=&games[]=1&games[]=2&games[]=3&games[]" + "=4&games[]=5&games[]=6&games[]=7&games[]=8&games[]=9&games[]=10&games[]=11&take=" + str(num_matches)
    
    
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
    
    num_results = 50
    find_winner = False
    
    if (len(sys.argv) > 1):
        num_results = int(sys.argv[1])
    if (len(sys.argv) > 2):
        find_winner = (int(sys.argv[2]) > 0)
    
    upcoming = not find_winner
    
    request_matches(num_results, upcoming, find_winner)