"""
Configuração e utilitários para integração com ImageKit.io
Compatível com imagekitio v5.0.0+
"""
import os
from typing import Optional, Dict, Any

# Configuração do ImageKit - inicialização lazy para evitar erros quando variáveis não estão definidas
_imagekit_instance = None
_imagekit_url_endpoint = None

def get_imagekit():
    """Retorna instância do ImageKit (lazy initialization)"""
    global _imagekit_instance, _imagekit_url_endpoint
    if _imagekit_instance is None:
        from imagekitio import ImageKit
        
        private_key = os.getenv('IMAGEKIT_PRIVATE_KEY', '')
        imagekit_id = os.getenv('IMAGEKIT_ID', '')
        
        if not private_key or not imagekit_id:
            # Retornar None se as credenciais não estiverem configuradas
            return None
        
        # API v5.0.0+ usa apenas private_key
        _imagekit_instance = ImageKit(
            private_key=private_key,
        )
        _imagekit_url_endpoint = f"https://ik.imagekit.io/{imagekit_id}"
    
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
        import base64
        from io import BytesIO
        
        file_to_upload = None
        
        # O SDK do ImageKit v5.0.0+ aceita:
        # 1. bytes diretamente
        # 2. File-like object (BufferedReader, BytesIO, etc)
        # 3. PathLike
        
        if isinstance(file, (bytes, bytearray)):
            # Já são bytes, enviar diretamente
            file_to_upload = file
            
        elif hasattr(file, 'read'):
            # É um file object (InMemoryUploadedFile, SpooledTemporaryFile, etc)
            try:
                file.seek(0)
                file_content = file.read()
                # Converter para bytes
                file_to_upload = file_content
                file.seek(0)  # Reset para caso precise reler
            except Exception as e:
                print(f"[DEBUG] Erro ao ler arquivo: {str(e)}")
                raise
        else:
            # Caso seja uma string ou outro tipo, tentar converter
            if isinstance(file, str):
                # Se for base64 ou caminho, não é suportado diretamente
                print(f"[ERROR] Tipo de arquivo não suportado: {type(file)}")
                return None
            file_to_upload = file
        
        options = {}
        if folder:
            options['folder'] = folder
        if tags:
            options['tags'] = tags
        options['use_unique_file_name'] = True
        
        # API v5.0.0+ usa files.upload() com bytes
        result = imagekit.files.upload(
            file=file_to_upload,
            file_name=file_name,
            **options
        )
        
        if result:
            url = None
            file_id = None
            name = None
            file_path = None
            thumbnail = None
            
            # URL
            url = getattr(result, 'url', None) or (result.get('url') if isinstance(result, dict) else None)
            
            # File ID (pode ser file_id ou fileId)
            file_id = (getattr(result, 'file_id', None) or 
                      getattr(result, 'fileId', None) or 
                      (result.get('file_id') if isinstance(result, dict) else None) or 
                      (result.get('fileId') if isinstance(result, dict) else None))
            
            # Name
            name = getattr(result, 'name', None) or (result.get('name') if isinstance(result, dict) else None)
            
            # File Path
            file_path = (getattr(result, 'file_path', None) or 
                        getattr(result, 'filePath', None) or 
                        (result.get('file_path') if isinstance(result, dict) else None) or
                        (result.get('filePath') if isinstance(result, dict) else None))
            
            # Thumbnail
            thumbnail = (getattr(result, 'thumbnail_url', None) or 
                        getattr(result, 'thumbnailUrl', None) or
                        (result.get('thumbnail_url') if isinstance(result, dict) else None) or 
                        (result.get('thumbnailUrl') if isinstance(result, dict) else None) or 
                        url)

            return {
                'url': url,
                'file_id': file_id,
                'name': name,
                'file_path': file_path,
                'thumbnail_url': thumbnail,
            }
        
        print(f"[DEBUG] Resultado do upload é None ou inválido")
        return None
        
    except Exception as e:
        print(f"[ERROR] Erro ao fazer upload para ImageKit: {str(e)}")
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
        # API v5.0.0+ usa files.delete()
        imagekit.files.delete(file_id=file_id)
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
    global _imagekit_url_endpoint
    
    # Garantir que o ImageKit foi inicializado para obter o endpoint
    imagekit = get_imagekit()
    if not imagekit or not _imagekit_url_endpoint:
        print("ImageKit não configurado. Defina IMAGEKIT_PRIVATE_KEY e IMAGEKIT_ID")
        return ""
    
    try:
        # Na API v5.0.0+, construímos a URL manualmente
        # Transformações no formato: tr:w-300,h-200
        if transformation:
            tr_parts = []
            for tr in transformation:
                for key, value in tr.items():
                    tr_parts.append(f"{key}-{value}")
            tr_string = ",".join(tr_parts)
            return f"{_imagekit_url_endpoint}/tr:{tr_string}/{file_path}"
        else:
            return f"{_imagekit_url_endpoint}/{file_path}"
    except Exception as e:
        print(f"Erro ao gerar URL do ImageKit: {str(e)}")
        return ""
