from urllib import request
from bs4 import BeautifulSoup
import Levenshtein
from time import sleep
from random import randrange
import os
# https://www.ap-siken.com/s/kakomon/05_aki/q1.html
def leven(string0, string1) -> float:
    return Levenshtein.distance(string0, string1)

def getUrl(extmNum):
    return 'https://www.ap-siken.com/s/kakomon/'+extms[extmNum]+'/'

def getSoup(extmNum,qNum):
    response = request.urlopen(getUrl(extmNum)+'q'+str(qNum)+'.html')
    return BeautifulSoup(response,'html.parser')

extms=['04_aki','04_haru','03_aki','03_haru','02_aki','01_aki','31_haru','30_aki','30_haru','29_aki','29_haru','28_aki','28_haru','27_aki','27_haru']
# html=''
# for i in range(len(extms)):
#     for j in range(80):
#         soup=str(getSoup(i,j+1).find(class_='sentence')).replace('src="','src="https://www.ap-siken.com')
#         html+=soup+'\n'
#     print('test:'+str(i))
# f=open('hhhh','w',encoding='utf-8')
# f.write(html)
# f.close()


# print(str(getSoup(0,28).find(class_='sentence')).replace('src="','src="https://www.ap-siken.com'))
# print(str(getSoup(0,28).find(class_='selectList').find_all('li')).replace('src="','src="https://www.ap-siken.com'))


# スクレイピングによる問題抽出
# def questionDataSave(extmNum,qNum):
#     questionCode=getSoup(extmNum,qNum).find(class_='sentence')
#     questionCode=str(questionCode).replace('src="','src="https://www.ap-siken.com')
#     f = open(extms[extmNum]+'/q'+str(qNum)+'.txt', 'w',encoding='utf-8')
#     f.write(questionCode)
#     f.close()

# スクレイピングによる解答群抽出
# for i in range(len(extms)):
#     for j in range(80):
#         selects=str(getSoup(i,j+1).find(class_='selectList')).replace('src="','src="https://www.ap-siken.com')
#         if(selects=='None'):
#             selects=str(getSoup(i,j+1).find_all(class_='roundBox')[1]).replace('src="','src="https://www.ap-siken.com')
#         f = open(extms[i]+'/a'+str(j+1)+'.txt', 'w',encoding='utf-8')
#         f.write(selects)
#         f.close()

# スクレイピングによる答え抽出
# for i in range(len(extms)):
#     for j in range(80):
#         f=open(extms[i]+'/s'+str(j+1)+'.txt','w',encoding='utf-8')
#         f.write(getSoup(i,j+1).find(class_='answer').text)
#         f.close()

# スクレイピングによる解説抽出
# for i in range(len(extms)):
#     for j in range(80):
#         f = open(extms[i]+'/k'+str(j+1)+'.txt', 'w',encoding='utf-8')
#         f.write(str(getSoup(i,j+1).find(id='kaisetsu')).replace('src="','src="https://www.ap-siken.com'))
#         f.close()