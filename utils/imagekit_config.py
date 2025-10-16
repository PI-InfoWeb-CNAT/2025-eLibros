"""
Configuração e utilitários para integração com ImageKit.io
"""
import os
from typing import Optional, Dict, Any

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
        # Ler o conteúdo do arquivo
        if hasattr(file, 'read'):
            file_content = file.read()
            # Voltar o ponteiro para o início se for um arquivo
            if hasattr(file, 'seek'):
                file.seek(0)
        else:
            file_content = file
        
        # Fazer upload
        result = imagekit.upload_file(
            file=file_content,
            file_name=file_name,
            options={
                "folder": folder,
                "tags": tags or [],
                "use_unique_file_name": True,
                "response_fields": ["url", "fileId", "name", "filePath", "thumbnailUrl"]
            }
        )
        
        if result and hasattr(result, 'response_metadata'):
            response = result.response_metadata
            return {
                'url': response.url,
                'file_id': response.file_id,
                'name': response.name,
                'file_path': response.file_path,
                'thumbnail_url': getattr(response, 'thumbnail_url', response.url),
            }
        
        return None
        
    except Exception as e:
        print(f"Erro ao fazer upload para ImageKit: {str(e)}")
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
