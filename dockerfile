FROM python:2.7

ADD print_colors.py /

CMD [ "python", "./print_colors.py" ]