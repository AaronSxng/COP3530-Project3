import wikipediaapi
    

def exportLink(pagename):
    wiki_wiki = wikipediaapi.Wikipedia('WikiRacer', 'en')

    page_py = wiki_wiki.page(pagename)
    print("Page - Exists: %s" % page_py.exists())

    def print_links(page):
            links = page.links
            for title in sorted(links.keys()):
                print("%s: %s" % (title, links[title]))

    print_links(page_py)

if __name__ == "__main__":
     exportLink("Bob Ross")