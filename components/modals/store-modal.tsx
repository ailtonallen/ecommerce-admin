"use client"

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import { useStoreModal } from "@/hooks/use-store-modal"
import { useState } from "react";

import { useForm } from "react-hook-form";
import { Modal } from "../ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";


const formSchema= z.object({
    name: z.string().min(1),
});

export const StoreModal = () =>{
    const storeModal = useStoreModal();

    const[loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
        },
    });

    const onSubmit =async (values:z.infer<typeof formSchema>) => {
try{
setLoading(true);

const response = await axios.post('/api/stores', values);


window.location.assign(`/${response.data.id}`);
}catch (error){
    toast.error("Algo deu errado!");
}finally{
    setLoading(false);
}
        //Criar loja        
    }

    return(
    <Modal 
    title="Criar uma loja"
    descripcion="Adiciona uma loja para gerenciar produtos e categorias"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}>
  <div className="space-y-5 py-3 pb-5">
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
     <FormField control={form.control}
     name="name"
     render={({field}) => (
<FormItem>
    <FormLabel> Nome:
        <FormControl>
            <Input disabled={loading} placeholder="Ex: NF Store" {...field}/>
        </FormControl>
        <FormMessage/>
    </FormLabel>
</FormItem>
     )} />
     <div className="pt-7 space-x-3 flex items-center justify-end">
<Button disabled={loading} variant="outline" onClick={storeModal.onClose}>Cancelar</Button>
<Button disabled={loading} type="submit">Criar</Button>
     </div>
    </form>
    </Form>

  </div>
    </Modal>
    );
};