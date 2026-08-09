import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import UsuarioRequests from "../../../fetch/UsuarioRequests";
import { useToast } from "../../../hooks/useToast";
import styles from "./AvatarUploader.module.css";

interface AvatarUploaderProps {
  /** URL do avatar atual (null = sem avatar) */
  avatarUrl?: string | null;
  /** Iniciais a exibir quando não há avatar */
  iniciais: string;
  /** Chamado após upload bem-sucedido com a nova URL */
  onAvatarAtualizado: (novaUrl: string) => void;
}

/**
 * AvatarUploader
 *
 * Exibe avatar do usuário (imagem ou iniciais como fallback).
 * Ao clicar, abre o file-picker (imagens até 2 MB).
 * Faz upload para PUT /api/usuario/avatar e notifica o pai.
 */
export function AvatarUploader({
  avatarUrl,
  iniciais,
  onAvatarAtualizado,
}: AvatarUploaderProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [carregando, setCarregando] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl ?? null);

  const handleClick = () => {
    if (!carregando) inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica no client (o backend também valida)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2 MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem válido.");
      return;
    }

    // Preview otimista
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setCarregando(true);
    try {
      const res = await UsuarioRequests.uploadAvatar(file);
      if (res.sucesso && res.avatar_url) {
        toast.success("✅ Foto de perfil atualizada!");
        onAvatarAtualizado(res.avatar_url);
      } else {
        // Reverter preview em caso de erro
        setPreviewUrl(avatarUrl ?? null);
        toast.error(res.erro || "Não foi possível atualizar o avatar.");
      }
    } finally {
      setCarregando(false);
      // Limpa input para permitir re-seleção do mesmo arquivo
      if (inputRef.current) inputRef.current.value = "";
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.avatarBtn}
        onClick={handleClick}
        title="Alterar foto de perfil"
        aria-label="Alterar foto de perfil"
      >
        {/* Avatar ou iniciais */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar"
            className={styles.avatarImg}
            onError={() => setPreviewUrl(null)}
          />
        ) : (
          <div className={styles.avatarInitials}>{iniciais}</div>
        )}

        {/* Overlay de hover */}
        {!carregando && (
          <div className={styles.overlay}>
            <Camera size={16} strokeWidth={2.5} />
            <span>Alterar</span>
          </div>
        )}

        {/* Spinner durante upload */}
        {carregando && (
          <div className={styles.spinnerBadge}>
            <div className={styles.spinner} />
          </div>
        )}
      </button>

      {/* Badge câmera (canto inferior direito) */}
      {!carregando && (
        <div className={styles.cameraBadge}>
          <Camera size={11} strokeWidth={2.5} />
        </div>
      )}

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/*"
        className={styles.fileInput}
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  );
}

export default AvatarUploader;
