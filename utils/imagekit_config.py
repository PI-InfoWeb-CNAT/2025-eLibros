"""
Configuração e utilitários para integração com ImageKit.io
"""
import os
from typing import Optional, Dict, Any
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

# Configuração do ImageKit - inicialização lazy para evitar erros quando variáveis não estão definidas
_imagekit_instance = None

def get_imagekit():
    """Retorna instância do ImageKit (lazy initialization)"""
    global _imagekit_instance
    if _imagekit_instance is None:
        from imagekitio import ImageKit
        
        private_key = os.getenv('IMAGEKIT_PRIVATE_KEY', '')
        imagekit_id = os.getenv('IMAGEKIT_ID', '')
        
        if not private_key or not imagekit_id:
            # Retornar None se as credenciais não estiverem configuradas
            return None
        
        _imagekit_instance = ImageKit(
            private_key=private_key,
            public_key='public_Iq6eqMKcdckCLNSaXJOegCGbJwQ=',
            url_endpoint=f"https://ik.imagekit.io/{imagekit_id}"
        )
    
    return _imagekit_instance


def upload_image_to_imagekit(
    file,
    file_name: str,
    folder: str = "uploads",
    tags: Optional[list] = None
) -> Optional[Dict[str, Any]]:
    """
    Faz upload de uma imagem para o ImageKit.io
    
    Args:
        file: Arquivo de imagem (pode ser file object ou bytes)
        file_name: Nome do arquivo
        folder: Pasta no ImageKit onde salvar a imagem
        tags: Tags opcionais para organização
    
    Returns:
        Dict com informações do upload (url, fileId, etc) ou None se falhar
    """
    imagekit = get_imagekit()
    if not imagekit:
        print("ImageKit não configurado. Defina IMAGEKIT_PRIVATE_KEY e IMAGEKIT_ID")
        return None
    
    try:
        file_to_upload = None
        # Caso já seja bytes/bytearray, embrulhar em BytesIO
        if isinstance(file, (bytes, bytearray)):
            import io
            file_to_upload = io.BytesIO(file)
            file_to_upload.name = file_name
            file_to_upload.seek(0)
        # Caso seja um objeto com método read, usar o próprio objeto (ex: InMemoryUploadedFile, SpooledTemporaryFile)
        elif hasattr(file, 'read'):
            try:
                # garantir ponteiro no início
                file.seek(0)
            except Exception:
                pass
            file_to_upload = file
        else:
            # fallback: passar como está (pode ser um caminho ou outro tipo aceito pela SDK)
            file_to_upload = file
        
        # Fazer upload
        options = UploadFileRequestOptions(
            folder=folder,
            use_unique_file_name=True
        )
        
        result = imagekit.upload_file(
            file=file_to_upload,
            file_name=file_name,
            options=options
        )
        
        if result:
            # Acessar atributos do UploadFileResult
            url = getattr(result, 'url', None) or result.get('url') if isinstance(result, dict) else None
            file_id = getattr(result, 'file_id', None) or getattr(result, 'fileId', None) or (result.get('file_id') if isinstance(result, dict) else None) or (result.get('fileId') if isinstance(result, dict) else None)
            name = getattr(result, 'name', None) or (result.get('name') if isinstance(result, dict) else None)
            file_path = getattr(result, 'file_path', None) or getattr(result, 'filePath', None) or (result.get('file_path') if isinstance(result, dict) else None)
            thumbnail = getattr(result, 'thumbnail_url', None) or (result.get('thumbnail_url') if isinstance(result, dict) else None) or url

            return {
                'url': url,
                'file_id': file_id,
                'name': name,
                'file_path': file_path,
                'thumbnail_url': thumbnail,
            }
        
        return None
        
    except Exception as e:
        print(f"Erro ao fazer upload para ImageKit: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def delete_image_from_imagekit(file_id: str) -> bool:
    """
    Deleta uma imagem do ImageKit.io
    
    Args:
        file_id: ID do arquivo no ImageKit
    
    Returns:
        True se deletado com sucesso, False caso contrário
    """
    imagekit = get_imagekit()
    if not imagekit:
        print("ImageKit não configurado. Defina IMAGEKIT_PRIVATE_KEY e IMAGEKIT_ID")
        return False
    
    try:
        result = imagekit.delete_file(file_id)
        return True
    except Exception as e:
        print(f"Erro ao deletar arquivo do ImageKit: {str(e)}")
        return False


def get_imagekit_url(
    file_path: str,
    transformation: Optional[list] = None
) -> str:
    """
    Gera URL com transformações do ImageKit
    
    Args:
        file_path: Caminho do arquivo no ImageKit
        transformation: Lista de transformações a aplicar
    
    Returns:
        URL completa da imagem
    """
    imagekit = get_imagekit()
    if not imagekit:
        print("ImageKit não configurado. Defina IMAGEKIT_PRIVATE_KEY e IMAGEKIT_ID")
        return ""
    
    try:
        url_obj = imagekit.url({
            "path": file_path,
            "transformation": transformation or []
        })
        return url_obj
    except Exception as e:
        print(f"Erro ao gerar URL do ImageKit: {str(e)}")
        return ""
