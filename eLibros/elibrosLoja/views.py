from django.views.generic import TemplateView


class HomePageView(TemplateView):
    template_name = "elibrosLoja/home.html"


class AboutPageView(TemplateView):
    template_name = "elibrosLoja/about.html"
