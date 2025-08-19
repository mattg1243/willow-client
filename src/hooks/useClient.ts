import {
  createClient,
  deleteClients,
  getClient,
  getClients,
  updateClient,
} from "@/lib/api/clients";
import { Client } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useClient = (id: string) => {
  return useQuery<Client | void>({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", id] });
    },
  });
};

export const useDeleteClients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteClients(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
