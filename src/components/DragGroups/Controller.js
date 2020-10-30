
/*
 * Controller Groups.
 * Author Nikonov Vitaliy
 */
import { ajax } from 'rxjs/ajax';
import { groupBy, map, mergeMap, reduce, switchMap } from 'rxjs/operators';
import { request, getToken } from 'config';

export default class Controller {
  constructor() {
    this.collection = [];
    this.parent = 0;
    this.first = { groups:[], selected: 0 };
    this.second = { groups:[], selected: 0 };
    this.loading = false;
    this.doneFetch = (collection) => {console.log(collection)};
  }
  // Функция для переопределения ошибок
  error(err) {
    console.log(err)
  }
  // Функция для переопределения и получения групп
  complete(){
    this.doneFetch(this.collection)
  }

  // Запрос всех групп в простом линейном массиве
  fetchData() {
    // Задача разбить массив на обьект матрешки с вложенностями
    const result = { first: [], last: [] };
    ajax({
      url: request(`group`),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      }
    }).pipe(
      switchMap(res => res.response.data),
      // В каждую группу добавляем массив для вложенности
      map(group => ({...group, parent: []})),
      // Группировка для родителей и дочерних групп
      groupBy(group => group.parentID === 0),
      // Заполняем разделенные массивы
      mergeMap(group$ => group$.pipe(reduce((acc, cur) => [...acc, cur], [`${group$.key}`]))),
    )
    .subscribe(
      // Распределение групп родителей и детей
      arr => {
        if(arr[0] === "true") {
          result.first =  arr.slice(1);
        } else {
          result.last = arr.slice(1);
        }
      },
      // Обработка ошибок
      error => this.error(error),
      // Финальная подготовка результата обработки
      () => {
        // Массив матрешка в которой
        this.collection = result.first.map(group => {
          result.last.forEach(last => {
            result.last.forEach(lst => {
              if (last.id === lst.parentID && last.parent.length === 0) {
                last.parent.push(lst)
              }
            })
            if(group.id === last.parentID) {
              group.parent.push(last);
            }
          })
          return group;
        })
        this.done = true;
        this.complete();
      }
    )
  }
  // Список матрешки 1 - го уровня
  prepareSelectList(id){
    const select = {
      groups: [],
      selected: 0,
    };
    this.collection.forEach(group => {
      // В списке должны быть родители без дочерних групп
      if(group.parent.length === 0) {
        select.groups.push(group);
        return
      }
      // В списке должны быть все дочерние группы и внучатые группы кроме внука ролителя
      group.parent.forEach(child => {
        // Отмечаем текущую дочерную группу как уже выбранного
        if(child.parentID === id) {
          select.selected = child.id
        }
        // Если внука нет то просто добавляем дочернюю группу
        if (child.parent.length === 0){
          select.groups.push(child)
          return
        }
        // Выборка внуков кроме вложенного в дочерную
        child.parent.forEach(grandson => {
          if(grandson.parentID !== select.selected){
            select.groups.push(grandson)
          }
        })
        select.groups.push(child)
      });
    })
    this.parent = id;
    this.first = select;
    this.prepareSecondSelectList(select.selected)
  }
  // Список матрешки 2 - го уровня
  prepareSecondSelectList(id){
    const select = {
      groups: [],
      selected: 0,
    };
    this.collection.forEach(group => {
      // В списке должны быть родители без дочерних групп
      if(group.parent.length === 0) {
        select.groups.push(group);
        return;
      }
      // В списке должны быть все дочерние группы без внуков и внучатые группы родителя внука
      group.parent.forEach(child => {
        // Если внука нет то просто добавляем дочернюю группу
        if (child.parent.length === 0){
          select.groups.push(child);
          return;
        }
        // Выборка внуков кроме вложенного в дочерную
        child.parent.forEach(grandson => {
          if(grandson.parentID === id){
            select.selected = grandson.id;
          } 
          select.groups.push(grandson);
        })
      });
    })
    this.second = select;
  }
  getFirstSelectList() { return this.first }
  getSecondSelectList() { return this.second }
  // Изменение группы первого уровня
  changeFirstGroup(event) {
    const id = parseInt(event.target.value, 10)
    // Смена групы 1-го уровня
    this.collection.forEach((group, index) => {
      if(group.parent.length > 0 && group.parent[0].id === id){
        this.collection[index].parent = [];
      }
      if(group.id === this.parent){
        this.first.groups.forEach(child => {
          if(child.id === id){
            child.parentID = this.parent
            this.collection[index].parent[0] = child;
          }
        })
      }
    })
    this.prepareSelectList(this.parent);
  }
  changeSecondGroup(event) {
    const id = parseInt(event.target.value, 10)
    console.log('changeSecondGroup', id)
  }
}