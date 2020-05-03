import base64
import re
import datetime
from django.conf import settings
from bleach.sanitizer import Cleaner

ALLOWED_HTML_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i',
                     'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody',
                     'tr', 'th', 'td', 'pre', 'span', 'u', 'img', 'del', 'sup', 'sub', 'table', 'tbody', 'tr', 'td']

ALLOWED_HTML_ATTRIBUTES = {
    'a': ['href', 'name', 'target', 'title'],
    'img': ['src', 'data-file-name', 'data-size', 'data-proportion', 'data-rotate', 'alt', 'data-percentage',
            'data-index', 'data-file-size', 'data-origin', 'style'],
    'span': ['style', 'class'],
    'p': ['style', 'class'],
    'hr': ['class'],
    'abbr': ['title'],
    'acronym': ['title'],
}

ALLOWED_HTML_STYLES = ['font', 'font-size', 'font-style', 'font-weight', 'text-decoration', 'font-family', 'color',
                       'text-align', 'border', 'text-overflow', 'line-height', 'margin', 'padding',
                       'background', 'background-size', 'background-color', 'height', 'width',
                       'align', 'border-color', 'border-radius', 'border-style', 'box-sizing', 'box-shadow', 'float',
                       'justify-content', 'line-break', 'max-width', 'min-width', 'max-height', 'min-height',
                       'list-style-type', 'list-style', 'list-style-position', 'opacity', 'quotes', 'text-decoration',
                       'text-decoration-color', 'text-decoration-line', 'text-decoration-style', 'text-indent',
                       'text-justify', 'text-orientation', 'text-transform', 'top', 'bottom', 'left', 'right'
                                                                                                      'vertical-align',
                       'visibility', 'word-spacing', 'word-wrap', 'word-break', 'white-space',
                       'z-index']

ALLOWED_HTML_PROTOCOLS = ['https', 'http', 'data']


def include_base64_image(string):
    result = re.search(r'<img src=\"data:image\/.*?;base64,.*?\".*?>', string)
    return result is not None


def replace_base64_img_src_to_file_url_src(string, files):
    split_list = re.split(r'data:image\/.*?;base64,.*?\"', string)
    split_len = len(split_list)
    if split_len == 1:
        return string

    files_len = len(files)

    if split_len < 2:
        return string

    result_str = ''
    count = 0
    for el in split_list:
        if count > files_len - 1:
            result_str = result_str + el

        else:
            result_str = result_str + el + files[count] + '"'
            count += 1

    return result_str


def get_base64_img_info_from_str(string):
    img_data_list = get_base64_data_from_str(string)
    img_count = len(img_data_list)
    if len(img_data_list) < 1:
        return False

    ext_list = get_base64_img_extension_from_str(string)
    ext_count = len(ext_list)
    list_count = min(img_count, ext_count)

    result = []
    for i in range(list_count):
        result.append({'ext': ext_list[i], 'data': img_data_list[i]})
    return result


def get_base64_data_from_str(string):
    return re.findall(r'\<img src=\"data:image\/.*;base64,(.*?)\".*?>', string)


def get_base64_img_extension_from_str(string):
    return re.findall(r'src=\"data:image\/(.*);base64,', string)


def save_base64_to_img(data, file_path):
    img_data = base64.b64decode(data)
    with open(file_path, 'wb') as f:
        f.write(img_data)


def get_upload_file_path():
    return settings.MEDIA_ROOT + '/' + get_date_file_path()


def get_date_file_path():
    today = datetime.datetime.today()
    month = '{:02d}'.format(today.month)
    day = '{:02d}'.format(today.day)
    path = f"{today.year}/{month}/{day}/"
    return path


def sanitize_html(html_text):
    cleaner = Cleaner(
        tags=ALLOWED_HTML_TAGS,
        attributes=ALLOWED_HTML_ATTRIBUTES,
        styles=ALLOWED_HTML_STYLES,
        protocols=ALLOWED_HTML_PROTOCOLS,
        strip=True,
        strip_comments=True)
    return cleaner.clean(html_text)
