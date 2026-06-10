import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, FileText, Phone, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabase';
import { validarCPF } from '../utils/validadores';
import { loginComGoogle } from '../utils/auth';

export default function Cadastro() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
    });

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'cpf') {
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }

        if (name === 'telefone') {
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        if (!validarCPF(formData.cpf)) {
            setErro('O CPF informado é inválido.');
            setLoading(false);
            return;
        }

        if (formData.senha.length < 6) {
            setErro('A senha deve ter no mínimo 6 caracteres.');
            setLoading(false);
            return;
        }

        if (formData.senha !== formData.confirmarSenha) {
            setErro('As senhas não coincidem. Verifique e tente novamente.');
            setLoading(false);
            return;
        }

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.senha,
            });

            if (authError) throw authError;

            if (authData.user) {
                const cpfLimpo = formData.cpf.replace(/\D/g, '');
                const telefoneLimpo = formData.telefone.replace(/\D/g, '');

                const { error: dbError } = await supabase
                    .from('usuarios')
                    .insert([
                        {
                            id: authData.user.id,
                            nome: formData.nome,
                            cpf: cpfLimpo,
                            telefone: telefoneLimpo,
                            email: formData.email
                        }
                    ]);

                if (dbError) throw dbError;

                alert('Conta criada com sucesso! Você já pode acessar o jEM.');
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            setErro(error.message || 'Ocorreu um erro ao criar a conta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full bg-jem-text relative overflow-hidden flex items-center justify-center p-4">

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-jem-primary/30 blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-jem-accent/30 blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-jem-primary/20 blur-[120px]"></div>
            </div>

            <Link to="/" className="absolute top-8 left-8 z-20 flex items-center text-sm font-semibold text-white/70 hover:text-white transition-all">
                <ArrowLeft size={20} className="mr-2" />
                Voltar para o início
            </Link>

            <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-lg rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 p-6 sm:p-8 max-h-[95vh] overflow-y-auto custom-scrollbar">

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-jem-primary tracking-tight mb-2">Criar Conta</h1>
                    <p className="text-sm text-gray-500 font-medium">Preencha seus dados para começar.</p>
                </div>

                {erro && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
                        {erro}
                    </div>
                )}

                <div className="space-y-5">
                    <button
                        type="button"
                        onClick={loginComGoogle}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 h-12 rounded-xl font-bold text-base hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                        Cadastrar com Google
                    </button>

                    <div className="relative flex items-center py-1">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="shrink-0 px-4 text-xs text-gray-400 uppercase font-bold">ou com e-mail</span>
                        <div className="grow border-t border-gray-200"></div>
                    </div>

                    <form className="space-y-3" onSubmit={handleCadastro}>

                        <div className="relative">
                            <User className="absolute left-4 top-3.5 h-5 w-5 text-jem-primary" />
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Nome completo" className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-11 text-base focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all" />
                        </div>

                        <div className="relative">
                            <FileText className="absolute left-4 top-3.5 h-5 w-5 text-jem-primary" />
                            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required maxLength="14" placeholder="CPF" className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-11 text-base focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all" />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-jem-primary" />
                            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required maxLength="15" placeholder="Telefone com DDD" className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-11 text-base focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all" />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-jem-primary" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="E-mail" className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-11 text-base focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-jem-primary" />
                                <input
                                    type={mostrarSenha ? 'text' : 'password'}
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleChange}
                                    required
                                    placeholder="Senha (mín. 6)"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-jem-primary transition-colors"
                                >
                                    {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-jem-primary" />
                                <input
                                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirmar"
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm focus:ring-2 focus:ring-jem-primary focus:outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-jem-primary transition-colors"
                                >
                                    {mostrarConfirmarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-jem-primary text-white h-12 rounded-xl font-bold text-base hover:bg-jem-accent transition-all shadow-lg shadow-jem-primary/20 mt-2 flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Já possui conta? <Link to="/login" className="text-jem-primary font-bold hover:underline">Entre agora</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}