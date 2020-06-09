# generate difference

<a href="https://codeclimate.com/github/evgeniya-osmakova/frontend-project-lvl2/maintainability"><img src="https://api.codeclimate.com/v1/badges/70258f405a604054be99/maintainability" /></a> <a href="https://codeclimate.com/github/evgeniya-osmakova/frontend-project-lvl2/test_coverage"><img src="https://api.codeclimate.com/v1/badges/70258f405a604054be99/test_coverage" /></a> <a href="https://github.com/evgeniya-osmakova/frontend-project-lvl2/actions"><img src="https://github.com/evgeniya-osmakova/frontend-project-lvl1/workflows/Node%20CI/badge.svg" /></a>


Utility for finding differences in two configuration files (JSON, YAML, INI).

Publish package:

    make publish

Install package:

    npm link
    
Run package:

    gendiff [-f [stylish|plain|json]] pathToBeforeFile pathToAfterFile

Three types of difference file format: stylish(default), plain, json.

Options:

    -V, --version        output the version number
    -h, --help           output usage information
    -f, --format [type]  output format
    
    
    

Packet publish, install & demo flat YAML (default(stylish) format):
<a href="https://asciinema.org/a/629ThSdr8rJQRub4ixItguIbG" target="_blank"><img src="https://asciinema.org/a/629ThSdr8rJQRub4ixItguIbG.svg" /></a>

Demo: flat INI, default(stylish) format:
<a href="https://asciinema.org/a/kjlETqzgkWBJQX2z44CDum0gw" target="_blank"><img src="https://asciinema.org/a/kjlETqzgkWBJQX2z44CDum0gw.svg" /></a>

Demo: flat JSON, default(stylish) format:
<a href="https://asciinema.org/a/m0ue5wTLG1G48pT7u6PMBEXhf" target="_blank"><img src="https://asciinema.org/a/m0ue5wTLG1G48pT7u6PMBEXhf.svg" /></a>

Demo: recursion JSON, default(stylish) format:
<a href="https://asciinema.org/a/0WBe4xA7tUsIs7Uu33QStXAnQ" target="_blank"><img src="https://asciinema.org/a/0WBe4xA7tUsIs7Uu33QStXAnQ.svg" /></a>

Demo: recursion JSON, stylish format:
<a href="https://asciinema.org/a/YEIvTPpaKHphC7y6wySfyOyiW" target="_blank"><img src="https://asciinema.org/a/YEIvTPpaKHphC7y6wySfyOyiW.svg" /></a>

Demo: recursion YAML, plain format:
<a href="https://asciinema.org/a/FA6o087DvuEaEureGLjAPcoTx" target="_blank"><img src="https://asciinema.org/a/FA6o087DvuEaEureGLjAPcoTx.svg" /></a>

Demo: recursion INI, json format:
<a href="https://asciinema.org/a/H6wBTVc6t1G00AlMdFrsWHqiI" target="_blank"><img src="https://asciinema.org/a/H6wBTVc6t1G00AlMdFrsWHqiI.svg" /></a>
