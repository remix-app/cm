import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DownloadBillButton } from "./DownloadBillButton";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Mock de tRPC: Simulamos la estructura del cliente tRPC
vi.mock("@/lib/trpc", () => ({
  trpc: {
    financial: {
      getBillPdf: {
        useMutation: vi.fn(),
      },
    },
  },
}));

// Mock de sonner: Para verificar las notificaciones al usuario
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("DownloadBillButton", () => {
  const mockMutate = vi.fn();
  const commonExpenseId = 123;

  beforeEach(() => {
    // Limpiamos los mocks antes de cada test (aunque setup.ts ya lo hace, aquí reforzamos)
    vi.clearAllMocks();
    
    // Configuración base para la mutación de tRPC
    (trpc.financial.getBillPdf.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false, // tRPC v11 usa isPending en lugar de isLoading para mutaciones
    });
  });

  it("debe renderizar el botón con el texto e icono correctos", () => {
    render(<DownloadBillButton commonExpenseId={commonExpenseId} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText(/Descargar Boleta/i)).toBeInTheDocument();
    // Verifica que el icono de descarga esté presente (por su clase o rol si tuviera)
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("debe iniciar la mutación al hacer clic en el botón", () => {
    render(<DownloadBillButton commonExpenseId={commonExpenseId} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);
    
    expect(mockMutate).toHaveBeenCalledWith({ commonExpenseId });
  });

  it("debe mostrar estado de carga y deshabilitar el botón durante la descarga", () => {
    // Simulamos que la mutación está en curso
    (trpc.financial.getBillPdf.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<DownloadBillButton commonExpenseId={commonExpenseId} />);
    const button = screen.getByRole("button");
    
    // Forzamos el clic para activar el estado local isDownloading
    fireEvent.click(button);
    
    expect(screen.getByText(/Generando.../i)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("debe completar el flujo de descarga exitosamente", async () => {
    const mockPdfData = {
      pdfBase64: "JVBERi0xLjQKJ...==", // Simulación de contenido PDF
      fileName: "boleta_enero_2024.pdf"
    };

    // Configuramos la mutación para que dispare el callback onSuccess inmediatamente
    (trpc.financial.getBillPdf.useMutation as any).mockImplementation((options: any) => ({
      mutate: (vars: any) => {
        // Simulamos el comportamiento de onSuccess
        if (options && options.onSuccess) {
          options.onSuccess(mockPdfData);
        }
      },
      isPending: false,
    }));

    render(<DownloadBillButton commonExpenseId={commonExpenseId} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);

    // Verificamos que se haya llamado a toast.success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("debe mostrar un mensaje de error si la mutación falla", async () => {
    const errorMessage = "Error de conexión con el servidor";

    (trpc.financial.getBillPdf.useMutation as any).mockImplementation((options: any) => ({
      mutate: (vars: any) => {
        options.onError({ message: errorMessage });
      },
      isPending: false,
    }));

    render(<DownloadBillButton commonExpenseId={commonExpenseId} />);
    const button = screen.getByRole("button");
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });
});
