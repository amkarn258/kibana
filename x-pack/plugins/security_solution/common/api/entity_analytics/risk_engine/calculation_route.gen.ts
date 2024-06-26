/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Risk Scoring API
 *   version: 1
 */

import { z } from 'zod';

import {
  AfterKeys,
  DataViewId,
  Filter,
  PageSize,
  IdentifierType,
  DateRange,
  RiskScoreWeights,
  EntityRiskScoreRecord,
} from '../common/common.gen';

export type RiskScoresCalculationRequest = z.infer<typeof RiskScoresCalculationRequest>;
export const RiskScoresCalculationRequest = z.object({
  /**
   * Used to calculate a specific "page" of risk scores. If unspecified, the first "page" of scores is returned. See also the `after_keys` key in a risk scores response.
   */
  after_keys: AfterKeys.optional(),
  /**
   * The identifier of the Kibana data view to be used when generating risk scores. If a data view is not found, the provided ID will be used as the query's index pattern instead.
   */
  data_view_id: DataViewId,
  /**
   * If set to `true`, the internal ES requests/responses will be logged in Kibana.
   */
  debug: z.boolean().optional(),
  /**
   * An elasticsearch DSL filter object. Used to filter the data being scored, which implicitly filters the risk scores calculated.
   */
  filter: Filter.optional(),
  page_size: PageSize.optional(),
  /**
   * Used to restrict the type of risk scores calculated.
   */
  identifier_type: IdentifierType,
  /**
   * Defines the time period over which scores will be evaluated. If unspecified, a range of `[now, now-30d]` will be used.
   */
  range: DateRange,
  weights: RiskScoreWeights.optional(),
});

export type RiskScoresCalculationResponse = z.infer<typeof RiskScoresCalculationResponse>;
export const RiskScoresCalculationResponse = z.object({
  /**
   * Used to obtain the next "page" of risk scores. See also the `after_keys` key in a risk scores request. If this key is empty, the calculation is complete.
   */
  after_keys: AfterKeys,
  /**
   * A list of errors encountered during the calculation.
   */
  errors: z.array(z.string()),
  /**
   * The number of risk scores persisted to elasticsearch.
   */
  scores_written: z.number(),
  scores: z
    .object({
      /**
       * A list of host risk scores
       */
      host: z.array(EntityRiskScoreRecord).optional(),
      /**
       * A list of user risk scores
       */
      user: z.array(EntityRiskScoreRecord).optional(),
      /**
       * If 'wait_for' the request will wait for the index refresh.
       */
      refresh: z.literal('wait_for').optional(),
    })
    .optional(),
});
