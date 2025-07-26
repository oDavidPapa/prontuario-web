import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface CustomButtonGrid {
  icon: IconDefinition;     // ícone FontAwesome
  actionName: string;       // nome da ação para emitir
  tooltip?: string;         // dica ao passar o mouse (opcional)
  buttonClass?: string;   
}