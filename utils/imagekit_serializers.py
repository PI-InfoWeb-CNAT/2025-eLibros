"""
Serializers customizados para upload de imagens via ImageKit.io
"""
from rest_framework import serializers
from utils.imagekit_config import upload_image_to_imagekit, delete_image_from_imagekit


class ImageKitUploadMixin:
    """
    Mixin para adicionar funcionalidade de upload ao ImageKit.io em serializers
    """
    
    def handle_imagekit_upload(
        self,
        image_file,
        folder: str,
        instance=None,
        url_field: str = 'capa_url',
        file_id_field: str = 'capa_file_id'
    ) -> dict:
        """
        Faz upload de imagem para ImageKit e retorna dados atualizados
        
        Args:
            image_file: Arquivo de imagem enviado
            folder: Pasta no ImageKit (ex: 'livros', 'perfis')
            instance: Instância do modelo (para deletar imagem antiga)
            url_field: Nome do campo que armazena a URL
            file_id_field: Nome do campo que armazena o file_id
        
        Returns:
            Dict com url_field e file_id_field atualizados
        """
        result = {}
        
        # Se há uma instância existente com imagem, deletar a antiga
        if instance:
            old_file_id = getattr(instance, file_id_field, None)
            if old_file_id:
                delete_image_from_imagekit(old_file_id)
        
        # Upload da nova imagem
        if image_file:
            upload_result = upload_image_to_imagekit(
                file=image_file,
                file_name=image_file.name,
                folder=folder,
                tags=[folder]
            )
            
            if upload_result:
                result[url_field] = upload_result['url']
                result[file_id_field] = upload_result['file_id']
        
        return result


class ImageKitImageField(serializers.ImageField):
    """
    Campo customizado que aceita upload de imagem e retorna apenas a URL
    """
    
    def to_representation(self, value):
        """
        Retorna a URL da imagem em vez do objeto ImageField
        """
        # value aqui será a URL string, não um ImageField
        return value if value else None
    
    def to_internal_value(self, data):
        """
        Processa o upload da imagem
        """
        # Validar que é uma imagem válida
        return super().to_internal_value(data)
