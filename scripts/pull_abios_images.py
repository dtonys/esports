'''
Created on Nov 30, 2015

@author: Joseph

1. make a request to abios gaming for latest matches
2. download all the team logos
3. print each of the team information
    get:
     internal name (remove spaces from actual name)
     icon url
     display name
'''

import requests
import json
import shutil

def save_team(team_name, team_logo_url):
    team_internal = team_name.replace(" ", "").lower()
    
    splitted = team_logo_url.split('/')
    logo_filename = splitted[len(splitted) - 1]
            
    if logo_filename == 'team-placeholder.png':
        logo_filename = ''
    
    print "'" + team_internal + "': {"
    print "display_name:'" + team_name + "',"
    print "logo_url:'" + logo_filename + "'"
    print '},'
    
    if logo_filename != '':
        response = requests.get(team_logo_url, stream=True)
        with open("./output/" + logo_filename, 'wb') as out_file:
            shutil.copyfileobj(response.raw, out_file)
        del response
    
    return
    


def main():
    # make a request to abiosgaming for latest matches
    url = "http://abiosgaming.com/ajax/matches?games[]=&games[]=1&games[]=2&games[]=5&take=100"
    '''
    1: DOTA
    2: LOL
    5: CSGO
    '''
    url += "&upcoming=true"
    
    errors = []
    #make the request
    matches = requests.get(url)
    matches = json.loads(matches._content)

    #process each one.
    for match in matches:
        try:
            team1_name = match.get('compA_name')
            team1_logo_url = match.get('compA_logo')
            save_team(team1_name, team1_logo_url)
            
            
            team2_name = match.get('compB_name')
            team2_logo_url = match.get('compB_logo')
            save_team(team2_name, team2_logo_url)
            
        except Exception:
            errors.append(match)
    
    print '@@@@@@@@@@@@@@@@@@@@@@@@@@@'
    
    '''
    for errored in errors:
        print json.dumps(errored)
    '''
    
    return

if __name__ == '__main__':
    main()