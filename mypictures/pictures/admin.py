from django.contrib import admin
from django.utils.html import format_html

from pictures.models import Dofile


class ContactAdmin(admin.ModelAdmin):
    def updateButton(self, obj):
        button_html = """<a class="changelink" href="/admin/pictures/file/%s/change/">编辑</a>""" % (
            obj.id)
        return format_html(button_html)
    updateButton.short_description = "编辑"

    def deleteButton(self, obj):
        button_html = """<a class="deletelink" href="/admin/pictures/file/%s/delete/">删除</a>""" % (
            obj.id)
        return format_html(button_html)
    deleteButton.short_description = "删除"

    list_display = ('filename','md5_name', 'user','upload_date',"updateButton","deleteButton")  # list
    search_fields = ('author',)

admin.site.register(Dofile,ContactAdmin)
