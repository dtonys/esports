'''
Created on Nov 26, 2015

@author: Joseph
'''
from selenium import webdriver
import json
import time


def scrape_ELS_for_tournaments():
    
    driver = webdriver.PhantomJS()
    driver.get('http://www.esportlivescore.com/')
    time.sleep(5)
    
    driver.find_element_by_xpath("//a[@class='show-all-tournaments']").click()
    time.sleep(5)
    
    tourney_list = driver.find_elements_by_xpath("//li[@class='item  ']")
    
    for item in tourney_list:
        
        tourney_name = item.text.strip()
        
        if (len(tourney_name) < 2):
            continue
        
        tourney_url = item.find_element_by_xpath(".//a").get_attribute("href")
        tourney_url = tourney_url.replace("http://esportlivescore.com/to_", "").replace(".html", "")

        tourney_obj = {
                       'name': tourney_name,
                       'ELS_url': tourney_url}
        print(json.dumps(tourney_obj));
    
    
    driver.close()
    return

if __name__ == '__main__':
    scrape_ELS_for_tournaments()