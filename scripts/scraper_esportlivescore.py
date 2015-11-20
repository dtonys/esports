from selenium import webdriver
import json
import datetime


#prints json of game if it's valid.
def scrapeELSMatch(match_element):
    
    portion_home = match_element.find_element_by_xpath("//tr[@class=' event-home-team']")
    
    #find game first.
    game_section = portion_home.find_element_by_xpath("//td[@class='event-select  init-click-done ab-init-tooltip-done ab-init-click-done']/a")
    game_img_url = game_section.get_attribute('href')
    game_name = ""
    if game_img_url == "http://esportlivescore.com/g_dota.html":
        game_name = "DOTA2"
    elif game_img_url == "http://esportlivescore.com/g_csgo.html":
        game_name = "CSGO"
    elif game_img_url == "http://esportlivescore.com/leagueoflegends.html":
        game_name = "LOL"
    
    #if no valid game, just get out of here.
    if game_name == "":
        return
    
    '''
    team1name = portion_home.find_element_by_xpath("//td[@class='participant-name   init-click-done']/span/a").text
    
    #for some reason, this keeps thinking team2name is team1name. idk what's going on
    portion_away = match_element.find_element_by_xpath("//tr[@class=' event-away-team']")
    team2name = portion_away.find_element_by_xpath("//td[@class='participant-name   init-click-done']/span/a").text
    '''
    
    summary_section = portion_home.find_element_by_xpath("//td[@class='event-time init-click-done']/a")
    matchvs = summary_section.get_attribute("title")
    matchsplit = matchvs.split('vs')
    team1name = matchsplit[0].strip()
    team2name = matchsplit[1].strip()
    
    #since this is hidden, it doesn't work.
    #epoch = summary_section.find_element_by_xpath("//span[@class='phpunixtime']")
    
    thetime = summary_section.text.split(":")
    thedate = summary_section.find_element_by_xpath("//span").text.split("/")
    
    theyear = 2015 #HARDCODED YEAR FOR NOW.

    matchStartTime = datetime.datetime(theyear, thedate[0], thedate[1], thetime[0], thetime[1])#
    #epoch.text#datetime.datetime.fromtimestamp(epoch)
    
    tourney_name = ""
    
    result = {
              'gameName': game_name,
              'tourneyName': tourney_name,
              'outcomeNames':[team1name, team2name],
              'matchStartTime':matchStartTime}

    print json.dumps(result)
    
    return

def scrapeELSPage(driver, path):
    driver.get('http://www.esportlivescore.com/' + path)
    
    match_sections = driver.find_elements_by_xpath("//div[@class='tables']/table/tbody/tr")
    
    print 'sections:' + str(len(match_sections))
    
    for i in range(0, len(match_sections)):
        scrapeELSMatch(match_sections[i])
    
    
    return
    

def main():
    
    driver = webdriver.Firefox()
    
    scrapeELSPage(driver, "ty_notstarted.html")
    
    driver.get("http://esportlivescore.com/")
    driver.close()
    
    print 'done'
    return

if __name__ == "__main__":
    main()

