# Configuration file for the Sphinx documentation builder.
# Read https://www.sphinx-doc.org/en/master/usage/configuration.html for more options available

import sphinx_pdj_theme

# -- Project information

project = 'IP2Location Node.js'
copyright = '2023, IP2Location'
author = 'IP2Location'

release = '1.0.0'
version = '1.0.0'

# -- General configuration

extensions = [
    'sphinx.ext.duration',
    'sphinx.ext.doctest',
    'myst_parser',
    'sphinx_copybutton',
]

# https://myst-parser.readthedocs.io/en/latest/syntax/optional.html

myst_enable_extensions = [
    "colon_fence",
    "deflist",
    "fieldlist",
]

# templates_path = ['_templates']

# -- Options for HTML output

html_theme = 'sphinx_pdj_theme'
html_theme_path = [sphinx_pdj_theme.get_html_theme_path()]

# PDJ theme options, see the list of available options here: https://github.com/jucacrispim/sphinx_pdj_theme/blob/master/sphinx_pdj_theme/theme.conf
html_theme_options = {
    # Hide the name of the project above the search bar
    'home_link': 'hide'
}

# The name of an image file (relative to this directory) to place at the top
# of the sidebar.
html_logo = 'images/ipl-logo-square-1200.png'

# Favicon
html_favicon = 'images/favicon.ico'

html_title = "IP2Location Python"