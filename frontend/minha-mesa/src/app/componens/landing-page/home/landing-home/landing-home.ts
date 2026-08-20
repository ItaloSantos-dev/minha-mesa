import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
interface Coment{
  userName:string,
  coment:string
  rating:number
}
@Component({
  selector: 'app-landing-home',
  imports: [RouterLink],
  templateUrl: './landing-home.html',
  styleUrl: './landing-home.css',
})

export class LandingHome {
  coments: Coment[] = [
  {
    userName: 'Mariana Oliveira',
    coment: 'O Minha Mesa facilitou muito a organização das reservas do nosso restaurante. Agora conseguimos controlar tudo de forma muito mais simples.',
    rating: 5
  },
  {
    userName: 'Carlos Mendes',
    coment: 'A plataforma é muito prática e deixou nosso atendimento mais organizado. Os clientes também gostaram bastante da facilidade para fazer reservas.',
    rating: 5
  },
  {
    userName: 'Ana Beatriz',
    coment: 'Gostei bastante do sistema. O controle de mesas e horários ajuda muito na rotina do restaurante.',
    rating: 4
  },
  {
    userName: 'Rafael Santos',
    coment: 'Uma solução simples e eficiente para quem precisa organizar reservas sem complicação. Recomendo para outros restaurantes.',
    rating: 5
  },
  {
    userName: 'Juliana Costa',
    coment: 'Depois que começamos a utilizar o Minha Mesa, ficou muito mais fácil acompanhar as reservas e evitar conflitos de horários.',
    rating: 5
  },
  {
    userName: 'Lucas Ferreira',
    coment: 'O sistema é intuitivo e ajuda bastante na gestão do restaurante. Principalmente na organização das mesas e reservas.',
    rating: 4
  },
  {
    userName: 'Mariana Oliveira',
    coment: 'O Minha Mesa facilitou muito a organização das reservas do nosso restaurante. Agora conseguimos controlar tudo de forma muito mais simples.',
    rating: 5
  },
  {
    userName: 'Carlos Mendes',
    coment: 'A plataforma é muito prática e deixou nosso atendimento mais organizado. Os clientes também gostaram bastante da facilidade para fazer reservas.',
    rating: 5
  },
  {
    userName: 'Ana Beatriz',
    coment: 'Gostei bastante do sistema. O controle de mesas e horários ajuda muito na rotina do restaurante.',
    rating: 4
  },
  {
    userName: 'Rafael Santos',
    coment: 'Uma solução simples e eficiente para quem precisa organizar reservas sem complicação. Recomendo para outros restaurantes.',
    rating: 5
  },
  {
    userName: 'Juliana Costa',
    coment: 'Depois que começamos a utilizar o Minha Mesa, ficou muito mais fácil acompanhar as reservas e evitar conflitos de horários.',
    rating: 5
  },
  {
    userName: 'Lucas Ferreira',
    coment: 'O sistema é intuitivo e ajuda bastante na gestão do restaurante. Principalmente na organização das mesas e reservas.',
    rating: 4
  },
  {
    userName: 'Camila Rodrigues',
    coment: 'A experiência foi muito positiva. Conseguimos reduzir bastante a confusão com reservas e horários nos dias mais movimentados.',
    rating: 5
  },
  {
    userName: 'Pedro Henrique',
    coment: 'Gostei da proposta e da facilidade de uso. A equipe conseguiu aprender a utilizar o sistema rapidamente.',
    rating: 4
  },
  {
    userName: 'Fernanda Almeida',
    coment: 'O gerenciamento das mesas ficou muito mais organizado depois que adotamos o Minha Mesa. Recomendo bastante.',
    rating: 5
  },
  {
    userName: 'Gabriel Martins',
    coment: 'Uma ótima ferramenta para restaurantes que ainda fazem o controle de reservas manualmente. Tornou nossa rotina muito mais prática.',
    rating: 5
  },
  {
    userName: 'Beatriz Souza',
    coment: 'A interface é simples e agradável, e conseguimos encontrar as informações das reservas rapidamente.',
    rating: 4
  },
  {
    userName: 'André Carvalho',
    coment: 'O sistema ajudou bastante na organização do nosso atendimento. Agora temos uma visão muito melhor das reservas do dia.',
    rating: 5
  },
  {
    userName: 'Larissa Mendes',
    coment: 'Muito bom para manter tudo centralizado. A gestão de mesas e horários ficou bem mais fácil para nossa equipe.',
    rating: 5
  },
  {
    userName: 'Thiago Rocha',
    coment: 'A solução atende muito bem ao que um restaurante precisa para organizar suas reservas. Simples, direto e eficiente.',
    rating: 4
  },
  {
    userName: 'Isabela Martins',
    coment: 'O Minha Mesa melhorou bastante a experiência dos nossos clientes, principalmente pela facilidade para realizar e acompanhar as reservas.',
    rating: 5
  },
  {
    userName: 'Bruno Oliveira',
    coment: 'Excelente ferramenta para modernizar a gestão do restaurante. A organização das reservas ficou muito melhor.',
    rating: 5
  }
];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  onScroll(): void {
    const el = this.scrollContainer.nativeElement;
    
    // Verifica se chegou ao fim do scroll horizontal (com margem de tolerância de 5px)
    const reachedEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    if (reachedEnd) {
      // Retorna para o início com animação suave
      el.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }
}
