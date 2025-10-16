from elibrosLoja.models.administrador import Administrador
from django.contrib.contenttypes.models import ContentType
from simple_history.admin import SimpleHistoryAdmin

class CustomSimpleHistoryAdmin(SimpleHistoryAdmin):
    def history_view(self, request, object_id, extra_context=None):
        request.current_app = self.admin_site.name
        model = self.model
        history = getattr(model, model._meta.simple_history_manager_attribute)
        
        # Pega o modelo correto (Administrador) ao invés do AUTH_USER_MODEL
        content_type = ContentType.objects.get_for_model(Administrador)
        
        # Define a view correta para o modelo Administrador
        admin_user_view = f"admin:{content_type.app_label}_{content_type.model}_change"
        
        extra_context = extra_context or {}
        extra_context['admin_user_view'] = admin_user_view
        
        return super().history_view(request, object_id, extra_context)