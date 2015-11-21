from selenium import webdriver
import json
import time


#prints json of game if it's valid.
def scrapeELSMatch(match_element):

    portion_home = match_element.find_element_by_xpath(".//tr[@class=' event-home-team']")

    #find game first.
    game_section = portion_home.find_element_by_xpath(".//td[@class='event-select  init-click-done ab-init-tooltip-done ab-init-click-done']/a")
    game_img_url = game_section.get_attribute('href')
    game_name = ""
    if game_img_url == "http://esportlivescore.com/g_dota.html":
        game_name = "DOTA2"
    elif game_img_url == "http://esportlivescore.com/g_csgo.html":
        game_name = "CSGO"
    elif game_img_url == "http://esportlivescore.com/g_leagueoflegends.html":
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

    summary_section = portion_home.find_element_by_xpath(".//td[@class='event-time init-click-done']/a")
    matchvs = summary_section.get_attribute("title")
    matchsplit = matchvs.split('vs')
    team1name = matchsplit[0].strip()
    team2name = matchsplit[1].strip()

    #since this is hidden, it doesn't work.
    epoch_text = summary_section.find_element_by_xpath(".//span[@class='phpunixtime']").get_attribute("textContent")
    epoch = (float(epoch_text)/1000)

    #mongodb timestring looks likes: 2015-12-18T16:47:28.016Z
    matchStartTime = time.strftime('%Y-%m-%dT%H:%M:%S', time.localtime(epoch))

    tourney_name = "blahblah"

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

    # if we've found none, then let's check one more time.
    if (len(match_sections) < 1):
        time.sleep(5)
        match_sections = driver.find_elements_by_xpath("//div[@class='tables']/table[1]/tbody/tr")


    #print 'sections in ' + path + ":" + str(len(match_sections))


    for i in range(0, len(match_sections)):
        section = match_sections[i]
        scrapeELSMatch(section)


    return


def main():

    driver = webdriver.Firefox()

    scrapeELSPage(driver, "ty_notstarted.html")

    driver.get("http://esportlivescore.com/")
    driver.close()

    #print 'done'
    return

if __name__ == "__main__":
    main()

