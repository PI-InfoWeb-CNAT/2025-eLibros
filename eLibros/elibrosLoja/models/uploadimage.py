from django.db import models  
  
class UploadImage(models.Model):  
    caption = models.CharField(max_length=200, blank=True, null=True)  
    image = models.ImageField(upload_to='fotos_de_perfil/')  
  
    def __str__(self):  
        return self.caption  