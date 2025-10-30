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
        import base64
        from io import BytesIO
        
        file_to_upload = None
        file_size = 0
        
        # CORREÇÃO: O SDK do ImageKit aceita 3 formatos:
        # 1. URL (string começando com http)
        # 2. Base64 string (data:image/...)
        # 3. File-like object (BufferedReader)
        # Quando recebemos bytes ou arquivo uploadado, precisamos converter para base64
        if isinstance(file, (bytes, bytearray)):
            # Converter para base64
            file_base64 = base64.b64encode(file).decode('utf-8')
            # Detectar o tipo MIME
            if file_name.lower().endswith('.jpg') or file_name.lower().endswith('.jpeg'):
                mime_type = 'image/jpeg'
            elif file_name.lower().endswith('.png'):
                mime_type = 'image/png'
            elif file_name.lower().endswith('.gif'):
                mime_type = 'image/gif'
            elif file_name.lower().endswith('.webp'):
                mime_type = 'image/webp'
            else:
                mime_type = 'image/jpeg'  # default
            
            file_to_upload = f"data:{mime_type};base64,{file_base64}"
            file_size = len(file)
        # Caso seja um objeto com método read, usar o próprio objeto (ex: InMemoryUploadedFile, SpooledTemporaryFile)
        elif hasattr(file, 'read'):          
            try:
                file.seek(0)
                file_content = file.read()
                
                # Converter para base64
                file_base64 = base64.b64encode(file_content).decode('utf-8')
                
                # Detectar o tipo MIME do arquivo
                mime_type = 'image/jpeg'
                if hasattr(file, 'content_type'):
                    mime_type = file.content_type
                elif file_name.lower().endswith('.png'):
                    mime_type = 'image/png'
                elif file_name.lower().endswith('.gif'):
                    mime_type = 'image/gif'
                elif file_name.lower().endswith('.webp'):
                    mime_type = 'image/webp'
                elif file_name.lower().endswith(('.jpg', '.jpeg')):
                    mime_type = 'image/jpeg'
                
                file_to_upload = f"data:{mime_type};base64,{file_base64}"
            except Exception as e:
                print(f"[DEBUG] Erro ao ler arquivo: {str(e)}")
                raise
        else:     
            file_to_upload = file
        
        options = UploadFileRequestOptions(
            folder=folder,
            use_unique_file_name=True,
            tags=tags or []
        )
        
        result = imagekit.upload_file(
            file=file_to_upload,
            file_name=file_name,
            options=options
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
