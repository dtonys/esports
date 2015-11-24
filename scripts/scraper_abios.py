'''
Created on Nov 24, 2015

@author: Joseph
'''
from selenium import webdriver
import json
import time
import sys

def scrapeAbiosMatch(match_element, find_winner=False):
    
    game_section = match_element.find_element_by_xpath(".//figure[@class='game-logo']/img")
    game_img_url= game_section.get_attribute("src")
    game_name = ""
    
    if (game_img_url == "https://img.abiosgaming.com/games/flat-rectangular-Dota-logo.jpg"):
        game_name = "DOTA2"
    elif (game_img_url == "https://img.abiosgaming.com/games/flat-rectangular-cs-go-logo.jpg"):
        game_name = "CSGO"
    elif (game_img_url == "https://img.abiosgaming.com/games/flat-rectangular-lol-logo.jpg"):
        game_name = "LOL"

    #no valid game name
    if (game_name == ""):
        return

    expand_section = match_element.find_element_by_xpath(".//article")
    
    tourney_name = expand_section.find_element_by_xpath(".//div[@class='matchDesc-title clearfix']/h4").get_attribute("textContent")
    
    teamelements = expand_section.find_elements_by_xpath(".//div[@class='teamName']")
    
    if len(teamelements) != 2:
        return
        
    team1name = teamelements[0].get_attribute("textContent").strip()
    team2name = teamelements[1].get_attribute("textContent").strip()
    
    match_date = expand_section.find_element_by_xpath(".//div[@class='shortInfo clearfix']/div[@class='pull-left']").get_attribute("textContent")
    match_date = match_date.split(" -")[0]
    match_date = match_date + " 15"
    
    pattern = '%B %d, %H:%M %y'
    matchStartTime = int(time.mktime(time.strptime(match_date, pattern)))
    
    
    game_obj = {
                'gameName': game_name,
                'tourneyName': tourney_name,
                'outcomeNames':[team1name, team2name],
                'matchStartTime':matchStartTime
                }
    
    
    print json.dumps(game_obj)
    
    return

def start_scraping():
    
    driver = webdriver.PhantomJS() #webdriver.Firefox()#
    
    driver.get('http://abiosgaming.com/calendar')
    time.sleep(5)
    
    match_sections = driver.find_elements_by_xpath("//div[@class='matches']/div")
    
    if (len(match_sections) < 1):
        time.sleep(5)
        match_sections = driver.find_elements_by_xpath("//div[@class='matches']/div")
    
    for i in range(0, len(match_sections)):
        scrapeAbiosMatch(match_sections[i], False)
    
    
    return

if __name__ == '__main__':
    
    start_scraping()