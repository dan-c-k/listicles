from fullWikiBuilder import nameMetrics, nmToWikiTitle, buildTable
import os
import pdb

def createWikiTitle(newKey):
	name = newKey[:newKey.index('-'):]

	if name == "baby names":
		return 'List of most popular given names'
	elif name == 'cities':
		return "List of most populous cities in the United States by decade"
	elif name == 'colleges':
		return 'Rankings of universities in the United States'
	elif name == 'dog breeds':
		return 'List of dog breeds'
	elif name == 'movies': #not great but ok
		return 'Academy Award for Best Picture'
	elif name == 'books':
		return 'Le Monde\'s 100 Books of the Century'
	elif name == 'vacation spots':
		return 'Tourist attractions in the United States'
	elif name == 'albums':
		return 'List of best-selling albums by year in the United States'
	elif name == 'tv shows':
		return 'Top-rated United States television programs by season'
	else:
		return "List of most populous cities in the United States by decade"

file = "/Users/danielknight/Downloads/inputs.txt"
titleKey = None
with open(file, "r+") as f:
	print('hi')
	titleKey = f.read()
	titleKey = titleKey.lower()
	titleKey = titleKey.replace('%','-')

print(titleKey)
tableToGrab = 3
key = titleKey.split('-')[0]
# metric = titleKey.split('-')[1]
# titleKey = key+'-'+metric.lower()
if key == 'books':
	tableToGrab = 0
if key == 'dog breeds':
	tableToGrab = 0
if key == 'cities':
	tableToGrab = 22


# print(titleKey)
# print(nmToWikiTitle)
# pdb.set_trace()	
title = createWikiTitle(titleKey)
print(title)

#buildTable with the appropiate args
buildTable(title,tableToGrab,"<table class=",'</table>','<tr>','</tr>','<td','</td>','demo.csv',[0,1])

#remove the file so we can do it again
# os.remove(file)
# print(file + "Removed!")