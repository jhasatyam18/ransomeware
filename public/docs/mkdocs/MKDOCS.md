# Prerequisites

-   Install Mkdocs using command :
    pip install mkdocs

-   Install pandoc to generate markdown file of the documentation

-   Install material UI plugin for themes using command :
    pip install mkdocs-material

# Steps

-   Create a folder named Project

-   For theme place mkdocs.yml file inside project folder

-   In the folder project create another folder named docs

-   Place the created markdown file of the documentation, images,stylesheet inside docs folder
 
-   Note : Markdown file name should be index.md

-   To generate Markdown file of the word document use pandoc command : 
    pandoc -f docx -t markdown_mmd --toc --toc-depth=2 --extract-media=. -s Datamotive-User-Guide_1_2.docx -o index.md

# Run and build the documentation

-   For seeing the documentation locally run 
    mkdocs serve 

-   To create a build run 
    mkdocs build
